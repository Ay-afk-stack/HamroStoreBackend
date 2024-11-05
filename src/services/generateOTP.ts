const generateOTP = () => {
  return Math.floor(900000 * Math.random() + 100000);
};

export default generateOTP;
