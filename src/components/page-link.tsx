import Link from 'next/link';

type PageLinkButtonProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

const PageLinkButton = (props: PageLinkButtonProps) => (
  <Link {...props} className={props.className}>
    {props.children}
  </Link>
);

export default PageLinkButton;
