// Simulated nationality/ID verification
module.exports = async function verifyID(nationalID) {
  // Here you could integrate real government API
  const fakeIDs = ["1234", "0000", "abcd"];
  return !fakeIDs.includes(nationalID);
};
