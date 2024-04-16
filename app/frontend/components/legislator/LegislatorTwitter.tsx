import { titleize } from "@sway/utils";
import { FiTwitter } from "react-icons/fi";
import { sway } from "sway";
import LegislatorCardSocialItem from "./LegislatorCardSocialItem";

interface IProps {
    legislator: sway.ILegislator;
    handleCopy: (twitter: string) => void;
}

const Button = ({ city, twitter }: { twitter: string; city: string }) => {
    const handleClick = () => {
        try {
            window.open(
                `https://twitter.com/intent/tweet?&hashtags=Sway${titleize(
                    city,
                )}&screen_name=${twitter.replace("@", "")}&ref_src=twsrc%5Etfw`,
                "_blank",
                `menubar=no,toolbar=no,location=yes,height=900,width=900,left=${window.screenX}`,
            );
        } catch (error) {
            console.error(error);
        }
    };

    return <FiTwitter onClick={handleClick} />;
};

const LegislatorTwitter: React.FC<IProps> = ({ legislator, handleCopy }) => {
    const { twitter, city } = legislator;
    if (!twitter) return null;

    const formatTwitter = () => {
        if (twitter.startsWith("@")) return twitter;

        return `@${twitter}`;
    };

    return (
        <LegislatorCardSocialItem
            title={"Twitter"}
            text={formatTwitter()}
            handleCopy={handleCopy}
            Icon={() => <Button city={city} twitter={twitter} />}
        />
    );
};

export default LegislatorTwitter;
