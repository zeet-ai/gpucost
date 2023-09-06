import twemoji from "twemoji";

export const Twemoji = ({ emoji }: { emoji: string }) => {
  const emojiSvg = twemoji.parse(emoji, {
    folder: "svg",
    ext: ".svg",
  });

  return <div dangerouslySetInnerHTML={{ __html: emojiSvg }} />;
};
