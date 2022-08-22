const redis = require("redis");
const mongoose = require("mongoose");
const util = require("util");


const redisURL = "";
const createClient = (url) => {
  return redis.createClient(url)
};

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(option={}) {
  this.isCache = true;
  this.hashKey = JSON.stringify(option.key || "");

  return this;
}

mongoose.Query.prototype.exec = async function() {
  try {
    if (!this.isCache){
      return exec.apply(this, arguments);
    }
    const client = createClient(redisURL);
    client.hget = util.promisify(client.hget);

    const key  = 
        JSON.stringify(
          Object.assign(
            this.getQuery(), 
            {collection: this.mongooseCollection.name}
          )
    );

    const cachedValues = await client.hget(this.hashKey, key);
    if(cachedValues){
        const doc = JSON.parse(cachedValues);
        return Array.isArray(doc) ? doc.map(doc => this.model(doc)) : this.model(doc);
    }
    const results = exec.apply(this, arguments);
    client.hset(this.hashKey, key, JSON.stringify(results), "EX", 10);
    return results;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  clearCache (hashKey) {
    try {
        const client = createClient(redisURL);
        client.del(JSON.stringify(hashKey))
    } catch (error) {
      throw error
    }
  }
}

