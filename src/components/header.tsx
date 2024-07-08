interface HeaderProps {
  wallet: React.ReactNode;
}

const Header = ({ wallet }: HeaderProps) => {
  return (
    <nav className="flex fixed top-0 left-1/2 -translate-x-1/2 w-full justify-between py-4 px-12 font-apex text-white items-center">
      <a href="/" className="text-sm sm:text-xxl text-center mt-2 w-1/4 sm:w-/12">
        ASTRAL OBSERVER
      </a>
      {wallet}
    </nav>
  );
};

export default Header;
