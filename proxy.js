var proxy = require('redbird')({port: 8000});

proxy.register("update.mattcprice.com", "localhost:3011");
