import Image from "next/image"

const Headshot = ({ src, alt, className }) => {

  className += ' rounded-full bg-gradient-to-tr from-gray-500 via-gray-300 to-gray-100';

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      width={128}
      height={128}
    />
  )
}

export default Headshot;
