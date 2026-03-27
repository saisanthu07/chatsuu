import { Link } from "react-router-dom";

const BrandLogo = ({
  to = "/",
  className = "",
  imageClassName = "h-10 w-auto",
  clickable = true,
  alt = "chatsuu logo",
}) => {
  const content = (
    <img
      src="/chatsuu-logo.svg"
      alt={alt}
      className={imageClassName}
      loading="eager"
      decoding="async"
    />
  );

  if (!clickable) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Link to={to} className={`inline-flex items-center ${className}`}>
      {content}
    </Link>
  );
};

export default BrandLogo;
