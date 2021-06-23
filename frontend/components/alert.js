const Alert = ({ title, subtitle }) => {
  return (
    <div
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
      role="alert"
    >
      <strong className="font-bold">{title}</strong>
      <span className="block sm:inline">{subtitle}</span>
    </div>
  );
};

Alert.defaultProps = {
  title: 'Whoops!',
  subtitle: 'Looks like there was an error on our end.',
};

export default Alert;
