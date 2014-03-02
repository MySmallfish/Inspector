(function (S) {
    S.DbType = {
        Text: "TEXT",
        Int: "INTEGER",
        Number: "NUMBER",
        DateTime: "DateTime",
        Boolean: "Boolean"
    };
    S.DatabaseDate = {
        toDatabase: function (date) {
            return date ? moment(date).format("YYYY-MM-DD HH:mm:ssz") : null;
        },
        fromDatabase: function(value) {
            return value ? moment(value).toDate() : null;
        }
    };

    function DatabaseBuilder(model) {

        function buildCreateTableSql(table) {
            var columnsSql = [];
            _.each(table.Columns,
                function (columnDefs) {
                    columnsSql.push("[");
                    columnsSql.push(columnDefs.Name);
                    columnsSql.push("]");
                    columnsSql.push(" ");
                    columnsSql.push(columnDefs.Type == S.DbType.DateTime ? S.DbType.Text : columnDefs.Type == S.DbType.Boolean ? S.DbType.Int : columnDefs.Type);
                    if (typeof columnDefs.Nullable !== "undefined" && !columnDefs.Nullable) {
                        columnsSql.push(" NOT ");
                    }
                    columnsSql.push("NULL");
                    if (columnDefs.IsPrimary) {
                        columnsSql.push(" PRIMARY KEY ASC ");
                    }
                    if (columnDefs.IsIdentity) {
                        columnsSql.push(" AUTOINCREMENT ");
                    }
                    columnsSql.push(",");
                });
            columnsSql.splice(columnsSql.length - 1, 1);
            var sql = "CREATE TABLE IF NOT EXISTS " + table.Name + " (" + columnsSql.join("") + ")";
            return sql;
        }

        function buildTable(transaction, table) {
            var sql = buildCreateTableSql(table);

            transaction.executeSql(sql, [], null, function (tx, e) {
                console.error(e);
            });
        }

        function build(transaction) {
            _.each(model.Tables,
                function (table) {
                    buildTable(transaction, table);
                });
        }

        return {
            build: build
        };

    }


    S.DatabaseServiceProvider = function () {
        var dataBases = {};
        var get = ["$q", function getService($q) {
            function convertValueToDatabaseValue(columnType, value) {
                switch (columnType) {
                    case S.DbType.DateTime:
                        return S.DatabaseDate.toDatabase(value);
                    case S.DbType.Boolean:
                        return (!!value && value !== "false") ? 1 : 0;
                    default:
                        return value;
                }
            }
            function convertValueFromDatabaseValue(columnType, value) {
                switch (columnType) {
                    case S.DbType.DateTime:
                        return S.DatabaseDate.fromDatabase(value);
                    case S.DbType.Boolean:
                        return !!value;
                    default:
                        return value;
                }
            }


            function parseScalar(results) {
                var result = null;
                if (results.rows.length > 0) {

                    result = results.rows.item(0).Result;
                }
                return $q.when(result);
            };
            function parseResults(results, table, model) {
                var items = [];
                for (var i = 0; i < results.rows.length; i++) {
                    var row = results.rows.item(i);
                    var item = {};
                    if (table && model) {
                        var columns = _.filter(table.Columns, function(column) {
                            return typeof row[column.Name] !== "undefined";
                        });
                        _.each(columns, function (column) {
                            //item[column.Name] = row[table.Name + "_" + column.Name];
                            
                            item[column.Name] = convertValueFromDatabaseValue(column.Type, row[column.Name]);
                            if (column.ForeignKey) {
                                var subItem = {};
                                var foreignTable = _.find(model.Tables, function (t) {
                                    return t.Name == column.ForeignKey.Table;
                                });
                                _.each(foreignTable.Columns, function (foreignColumn) {
                                    subItem[foreignColumn.Name] = row[foreignTable.Name + "_" + foreignColumn.Name];
                                });
                                item[column.Name] = subItem;
                            }
                        });
                    } else {
                        item = row;
                    }
                    items.push(item);
                }
                return items;

            }

            function executeOnTransaction(sql, args) {
                return function (transaction) {
                    var result = $q.defer();
                    transaction.executeSql(sql, args || [], function (tx, results) {
                        result.resolve({ transaction: tx, results: results });
                    }, function(tx, error) {
                        result.reject({ sql: sql, args: args, error: error });
                    });
                    return result.promise;
                };
            }

            function executeQuery(sql, args, options) {
                options = options || {};
                return function (transaction) {
                    return executeOnTransaction(sql, args, options)(transaction)
                        .then(function (result) {
                            var tx = result.transaction,
                                results = result.results;
                            var res = null;

                            if (options.getCount || options.getMax || options.isScalar) {
                                res = parseScalar(results);
                            } else {

                                res = parseResults(results, options.table, options.model);
                                if (options.single) {
                                    res = res[0];
                                }
                            }
                            return res;
                        });
                };
            }

            function executeNonQuery(dataBase) {
                return function (sql, args) {
                    var result = $q.defer();
                    execute(dataBase)(function (tx) {
                        executeOnTransaction(sql, args)(tx).then(result.resolve, result.reject);
                    }, function (tx, err) {
                        result.reject(err);
                    });

                    return result.promise;
                };
            }


            function executeRead(dataBase) {
                return function (sql, args, options) {
                    var result = $q.defer();
                    execute(dataBase)(function (tx) {
                        executeQuery(sql, args, options)(tx).then(result.resolve, result.reject);
                    }, function (tx, err) {
                        result.reject(err);
                    });

                    return result.promise;
                };
            }
            function executeScalar(dataBase) {
                return function (sql, args, options) {
                    var result = $q.defer();
                    execute(dataBase)(function (tx) {
                        executeQuery(sql, args, _.defaults(options, {
                            isScalar: true
                        }))(tx).then(result.resolve, result.reject);
                    }, function (tx, err) {
                        result.reject(err);
                    });

                    return result.promise;
                };
            }

            function execute(dataBase) {
                return function (cb, errorCb) {
                    var result = $q.defer();
                    dataBase.transaction(function (tx) {
                        cb(tx);
                    }, errorCb);
                    return result.promise;
                };
            }


            function buildTableColumnsExpression(ofTable, withAlias) {
                var sql = [];
                _.each(ofTable.Columns, function (column) {
                    sql.push("[" + withAlias + "].[" + column.Name + "] " + ofTable.Name + "_" + column.Name);
                });
                return sql.join(",");
            }

            function buildInsertSql(table, item) {
                var sql = ["INSERT INTO ["];
                sql.push(table.Name);
                sql.push("] (");
                var names = _.keys(item); // filter for those in table
                sql.push(_.map(names, function (name) {
                    return "[" + name + "]";
                }).join(","));
                sql.push(")");
                sql.push("VALUES (");
                sql.push(_.map(names, function () { return "?"; }).join(","));
                sql.push(");");
                return sql.join("");
            }
            function buildDeleteSql(table, whereClause) {

                var sql = ["DELETE FROM ["];
                sql.push(table.Name);
                sql.push("]");
                if (whereClause) {
                    sql.push(" WHERE ");
                    sql.push(whereClause);
                }

                return sql.join("");
            }
            function buildUpdateSql(table, names, whereClause) {
                var sql = ["UPDATE ["];
                sql.push(table.Name);
                sql.push("] SET ");
                sql.push(_.map(names, function (name) {
                    return ["[", name, "] = ?"].join("");
                }).join(","));

                if (whereClause) {
                    sql.push(" WHERE ");
                    sql.push(whereClause);
                }

                return sql.join("");
            }

            function buildWhereExpression(tableName, expressions) {
                var clause = [];

                _.each(expressions, function (expression) {
                    clause.push("[");
                    clause.push(expression[0]);
                    clause.push("]");
                    clause.push(" ");
                    clause.push(expression[1]);
                    clause.push(" ");
                    clause.push("?");
                });

                return clause.join("");
            }

            function addQueryArguments(args, expressions) {
                _.each(expressions, function (expression) {
                    args.push(expression[2]);
                });
            }

            function createTable(context, table, model) {
                var columns = {};
                _.each(table.Columns, function (column) {
                    columns[column.Name] = column;
                });

                function optimize(item, ignoreNulls) {
                    _.each(_.keys(item), function (key) {
                        if (typeof columns[key] == "undefined" || (item[key] == null && ignoreNulls)) {
                            delete item[key];
                        } else {
                            item[key] = convertValueToDatabaseValue(columns[key].Type, item[key]);
                        }
                    });
                }

                var queryable = {
                    table: table.Name,
                    where: function () {
                        var expressions = _.map(arguments, function (item) { return item; });
                        this.whereExpressions = this.orderByExpressions || [];
                        _.each(expressions, _.bind(function (expression) {
                            this.whereExpressions.push(expression);
                        }, this));

                        return this;
                    },
                    orderBy: function () {
                        var expressions = _.map(arguments, function (item) { return item; });
                        this.orderByExpressions = this.orderByExpressions || [];
                        _.each(expressions, _.bind(function (expression) {
                            this.orderByExpressions.push(expression);
                        }, this));

                        return this;
                    },
                    orderByDesc: function () {
                        var expressions = _.map(arguments, function (item) { return item; });
                        this.orderByExpressions = this.orderByExpressions || [];
                        _.each(expressions, _.bind(function (expression) {
                            this.orderByExpressions.push(expression + " DESC");
                        }, this));

                        return this;
                    },
                    clear: function () {
                        return context.executeNonQuery(buildDeleteSql(table)).then(_.bind(this.fin, this));
                    },
                    remove: function (items) {
                        
                        if (!items || items.length == 0) {
                            return $q.when({});
                        }

                        items = _.isArray(items) ? items : [items];
                        var promises =_.map(items, function(item) {
                            var whereClause, queryArgs = [];

                            if (this.whereExpressions && this.whereExpressions.length) {
                                whereClause = buildWhereExpression(table.Name, this.whereExpressions);
                                addQueryArguments(queryArgs, this.whereExpressions);
                            } else {
                                var keyValues = [];
                                whereClause = _.map(this.keys, function (column) {
                                    keyValues.push(item[column.Name]);
                                    var expr = "[" + column.Name + "] = ?";
                                    return expr;
                                });

                                _.each(keyValues, function (arg) { queryArgs.push(arg); });

                            }

                            var sql = buildDeleteSql(table, whereClause);

                            return context.executeNonQuery(sql, queryArgs);

                        });

                        return $q.all(promises).then(_.bind(this.fin, this));
                    },
                    update: function (items) {
                        if (!items || items.length == 0) {
                            return $q.when({});
                        }
                        items = _.isArray(items) ? items : [items];
                        
                        var whereClause, queryArgs;
                        var keys = this.keys, whereExpressions = this.whereExpressions;
                        var promises = _.map(items, function(item) {
                            optimize(item);
                            var names = _.filter(_.keys(item), function (name) {
                                return !_.some(keys, function (k) {
                                    return k.Name == name;
                                });
                            });
                            if (whereExpressions && whereExpressions.length) {
                                queryArgs = _.values(item);
                                whereClause = buildWhereExpression(table.Name, whereExpressions);
                                addQueryArguments(queryArgs, whereExpressions);
                            } else {
                                var keyValues = [];
                                whereClause = _.map(keys, function(column) {
                                    keyValues.push(item[column.Name]);
                                    delete item[column.Name];
                                    var expr = "[" + column.Name + "] = ?";
                                    return expr;
                                });
                                queryArgs = _.values(item);
                                _.each(keyValues, function (arg) { queryArgs.push(arg); });
                            }

                            var sql = buildUpdateSql(table, names, whereClause);
                            return context.executeNonQuery(sql, queryArgs);
                        });

                        return $q.all(promises).then(_.bind(this.fin, this));
                    },
                    insert: function (items) {
                        if (!items || items.length == 0) {
                            return $q.when({});
                        }

                        items = _.isArray(items) ? items : [items];

                        var promises = _.map(items, function (item) {
                            optimize(item, true);
                            var sql = buildInsertSql(table, item);
                            return context.executeNonQuery(sql, _.values(item));
                        });
                        return $q.all(promises).then(_.bind(this.fin, this));
                    },
                    selectFirst: function() {
                        return this.take(1).select();
                    },
                    take: function(count) {
                        this.limit = count;
                        return this;
                    },
                    select: function () {
                        var fields = arguments, fieldsExpression;

                        if (fields.length > 0 && fields[0] != "*") {
                            fieldsExpression = _.map(fields, function (field) {
                                return field;
                            }).join(",");
                        } else {
                            //fieldsExpression = buildTableColumnsExpression(table, "t");
                            fieldsExpression = "*";
                        }
                        var query = "SELECT " + fieldsExpression + " FROM [" + this.table + "] t",
                            queryArgs = [];


                        if (this.whereExpressions) {
                            query += " WHERE " + buildWhereExpression(this.table, this.whereExpressions);
                            addQueryArguments(queryArgs, this.whereExpressions);
                        }

                        if (this.orderByExpressions) {
                            query += " ORDER BY " + this.orderByExpressions.join(",");
                        }

                        if (this.limit) {
                            query += " LIMIT " + String(this.limit);
                        }

                        return context.executeRead(query, queryArgs,
                            {
                                table: table,
                                model: model,
                                single: this.limit == 1
                            }).then(_.bind(this.fin, this));
                    },
                    fin: function (value) {
                        delete this.whereExpressions;
                        delete this.orderByExpressions;
                        delete this.limit;
                        return value;
                    }
                };

                var identityColumn = _.find(table.Columns, function (i) {
                    return i.IsIdentity;
                });
                if (identityColumn) {
                    queryable.identityColumnName = identityColumn.Name;
                }

                queryable.keys = _.filter(table.Columns, function (column) {
                    return column.IsPrimary;
                });

                queryable.foreignKeyColumns = _.filter(table.Columns, function (column) {
                    return column.ForeignKey;
                });


                return queryable;
            }

            function buildContext(dataBase) {

                var name = dataBase.name;
                var context = {
                    name: name,
                    executeScalar: executeScalar(dataBase.dataBase),
                    executeRead: executeRead(dataBase.dataBase),
                    executeNonQuery: executeNonQuery(dataBase.dataBase)
                };

                _.each(dataBase.model.Tables, function (table) {
                    context[table.Name] = createTable(context, table, dataBase.model);
                });

                return context;
            };



            return function (name) {
                var dataBase = dataBases[name];
                if (typeof dataBase.context == "undefined") {
                    dataBase.context = buildContext(dataBase);
                }
                return dataBase.context;
            };
        }];



        function configure(model) {
            var builder = new DatabaseBuilder(model);
            var dataBase = verifyDatabase(model, builder.build);
            dataBases[model.Name] = {
                name: model.Name,
                model: model,
                dataBase: dataBase
            };
        }

        function verifyDatabase(model, createCallback, errorCallback) {
            try {

                function initializeDatabase(db) {
                    db.transaction(createCallback, errorCallback);
                }
                if (!window.openDatabase) {
                    alert('Databases are not supported in this browser.');
                } else {
                    var shortName = model.Name,
                        version = model.Version,
                        displayName = model.DisplayName,
                        maxSize = model.Size,
                        dataBase;
                    if (window.cordova) {
                        dataBase = window.openDatabase(shortName + "-" + version, version, displayName, maxSize);
                        initializeDatabase(dataBase);
                    } else {
                        dataBase = window.openDatabase(shortName + "-" + version, version, displayName, maxSize, initializeDatabase);
                    }
                    return dataBase;

                }
            } catch (e) {

                if (e == 2) {
                    // Version number mismatch.
                    //console.log("Invalid database version.");
                } else {
                    //console.log("Unknown error " + e + ".");
                }
                throw e;
            }
        }

        return {
            config: configure,
            $get: get
        };
    };
})(Simple);