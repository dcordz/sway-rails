import { SWAY_ASSETS_BUCKET_BASE_URL } from "app/frontend/sway_constants/google_cloud_storage";
import { Image } from "react-bootstrap";
import { sway } from "sway";

interface IProps {
    organization: sway.IOrganizationBase;
    maxWidth?: number;
}

const OrganizationIcon: React.FC<IProps> = ({ organization, maxWidth }) => {
    return (
        <Image
            alt={organization.name}
            style={{ maxWidth: maxWidth || 300 }}
            src={`${SWAY_ASSETS_BUCKET_BASE_URL}/${organization.iconPath}`}
            className="m-auto"
        />
    );
};

export default OrganizationIcon;
