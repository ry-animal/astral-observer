import Link from 'next/link';

type PageLinkButtonProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

const PageLinkButton = ({
  href,
  children,
  className = 'flex gap-4 text-xl bg-slate-800/75 p-4 rounded-lg w-72 text-center items-center justify-center',
  disabled = true,
}: PageLinkButtonProps) => {
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

  if (disabled) {
    return <div className={`${className} ${disabledClass}`}>{children}</div>;
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
};

export default PageLinkButton;
