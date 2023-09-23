import Image from "next/image";

function Logo() {
  return (
    <Image
      height={130}
      width={130}
      alt="Logo easy class"
      src={"/logo.svg"}
    />
  );
}

export default Logo;
