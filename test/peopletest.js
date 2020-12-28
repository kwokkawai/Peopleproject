const People = artifacts.require("People")
const truffleAssert = require("truffle-assertions");

contract("People", async function(accounts){

  let instance;

  before(async function(){
    instance = await People.deployed()
  });

  // beforeEach();
  // after();
  // afterEach();

  it("shouldn't create a person with age over 150 years", async function(){
    await truffleAssert.fails(instance.createPerson("Bob", 200, 190, {value: web3.utils.toWei("1", "ether")}), truffleAssert.ErrorType.REVERT);
  });
  it("shouldn't create a person without payment", async function(){
    await truffleAssert.fails(instance.createPerson("Bob", 50, 190, {value: 1000}), truffleAssert.ErrorType.REVERT);
  });
  it("should set senior status correctly", async function(){
    await instance.createPerson("Bob", 65, 190, {value: web3.utils.toWei("1", "ether")});
    let result = await instance.getPerson();
    assert(result.senior === true, "Senior level not set");
  });

  it("should not allow non-owner to delete people", async function(){
    await instance.createPerson("Bob", 65, 190, {value: web3.utils.toWei("1", "ether")});
    await truffleAssert.fails(instance.deletePerson(accounts[1],{from: accounts[1]}), truffleAssert.ErrorType.REVERT);
  });

  it("should allow owner to delete people", async function(){
  	instance = await People.new()
    await instance.createPerson("Bob", 65, 190, {value: web3.utils.toWei("1", "ether")});
    await truffleAssert.passes(instance.deletePerson(accounts[1],{from: accounts[0]}), truffleAssert.ErrorType.REVERT);
  });

})