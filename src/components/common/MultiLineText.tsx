interface MultiLineTextProps {
  text: string;
  className?: string;
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div';
}

export default function MultiLineText({ 
  text, 
  className = '', 
  as: Component = 'p' 
}: MultiLineTextProps) {
  return (
    <Component className={className}>
      {text.split('\n').map((line, i) => (
        <span key={i}>
          {line}
          {i < text.split('\n').length - 1 && <br />}
        </span>
      ))}
    </Component>
  );
}
