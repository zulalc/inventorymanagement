type HeaderProps = {
  name: string;
};

const Header = ({ name }: HeaderProps) => {
  return <h1 className="font-semibold text-2xl text-gray-700">{name}</h1>;
};

export default Header;
