module.exports = async function (srv) {
    srv.before("CREATE", "Expenses", async (oReq) => {
      console.log("let's try")
    });
}