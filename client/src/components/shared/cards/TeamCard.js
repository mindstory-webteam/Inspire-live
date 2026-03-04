import Link from "next/link";

const TeamCard = ({ teamMember }) => {
  const {
    id,
    name,
    desig,
    img       = "/images/team/team-1.webp",
    email     = "info@bexon.com",
    facebook  = "https://www.facebook.com/",
    instagram = "https://www.instagram.com/",
    twitter   = "https://x.com/",
    linkedin  = "https://www.linkedin.com/",
  } = teamMember || {};

  return (
    <div className="team-item left-swipe">
      <div className="team-img">
        <div className="team-img-inner">
          <img src={img} alt={name || "Team member"} />
        </div>
        <div className="social-links">
          <ul>
            <li>
              <Link href={facebook} target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-facebook-f"></i>
              </Link>
            </li>
            <li>
              <Link href={instagram} target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-instagram"></i>
              </Link>
            </li>
            <li>
              <Link href={twitter} target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-x-twitter"></i>
              </Link>
            </li>
            <li>
              <Link href={linkedin} target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-linkedin-in"></i>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="team-content">
        <h4 className="title">
          <Link href={`/team/${id}`}>{name}</Link>
        </h4>
        <span className="designation">{desig}</span>
        <Link className="mail-at" href={`mailto:${email}`}>
          <i className="tji-at"></i>
        </Link>
      </div>
    </div>
  );
};

export default TeamCard;