module.exports = {
  url: {
    production: {
      LANDING: "https://craft.js.org/",
      DOCUMENTATION: "https://craft.js.org/r/docs/overview/",
      BASIC_EXAMPLE: "https://craft.js.org/examples/basic/",
    },
    staging: {
      LANDING: "https://craft-js.prevwong.now.sh/",
      DOCUMENTATION: "https://craft-js.prevwong.now.sh/r/docs/overview/",
      BASIC_EXAMPLE: "https://craft-js.prevwong.now.sh/examples/basic/",
    },
    development: {
      LANDING: "http://localhost:3001/",
      DOCUMENTATION: "http://localhost:3000/r/docs/overview/",
      BASIC_EXAMPLE: "http://localhost:3002/",
    },
  }[process.env.ENV || "development"],
};
