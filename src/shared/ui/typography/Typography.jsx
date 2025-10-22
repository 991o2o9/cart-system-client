import styles from './Typography.module.scss';

const Tags = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  largeT: 'p',
  bodyT: 'p',
  smallT: 'p',
  extraSmallT: 'p',
  buttonT: 'p',
};

export const Typography = ({
  variant,
  weight,
  children,
  className,
  color,
  truncate = false,
  isParsed = false,
}) => {
  const uniqClassNames = [
    styles[variant],
    weight && styles[weight],
    color && styles[color],
    className && className,
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  const truncateString = (str, maxNumber) => {
    return str.length <= maxNumber ? str : str.slice(0, maxNumber) + '...';
  };

  const getContent = () => {
    if (!children) return null;

    let content = children;

    if (truncate && typeof content === 'string') {
      content = truncateString(content, truncate);
    }

    return content;
  };

  const TagName = isParsed ? 'div' : Tags[variant] || 'p';

  return <TagName className={uniqClassNames}>{getContent()}</TagName>;
};
