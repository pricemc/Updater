var proxy = require('redbird')({port: 8000});

proxy.register("localhost", "localhost:3011");
proxy.register("update.localhost", "localhost:3011");
