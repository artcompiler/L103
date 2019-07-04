module.exports = (compiler) => {
  return (req, res) => {
    const langID = compiler.langID || '107';
    res.send(`Hello, L${langID}!`);
  };
};
