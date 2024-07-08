import { Github, CameraIcon } from 'lucide-react';

const Footer = () => {
  return (
    <div className="flex fixed bottom-0 left-1/2 -translate-x-1/2 w-full justify-between font-bokrun text-xxs md:text-sm text-white py-4 px-12">
      <span className="flex gap-1">
        <span>created by</span>
        <a
          href="https://github.com/ry-animal/astral-observer"
          className="flex gap-1"
          target="_blank"
          rel="noreferrer noopenner"
        >
          ryanimal
          <Github size={16} className="inline-block mb-2" />
        </a>
      </span>
      <span className="flex gap-1">
        <span>background by </span>
        <a href="https://www.freepik.com/" className="flex gap-1" target="_blank" rel="noreferrer noopenner">
          freepik
          <CameraIcon size={16} className="inline-block" />
        </a>
      </span>
    </div>
  );
};

export default Footer;
