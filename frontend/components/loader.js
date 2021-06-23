import Loader from 'react-loader-spinner';

const CustomLoader = () => {
  return (
    <div className="flex justify-center">
      <Loader type="Circles" color="#00BFFF" height={30} width={30} />
    </div>
  );
};

export default CustomLoader;
