const TeamCard = ({ teamMember }) => {
  const {
    name,
    desig,
    img       = "/images/team/team-1.webp",
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
              <a href={facebook} target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
            </li>
            <li>
              <a href={instagram} target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-instagram"></i>
              </a>
            </li>
            <li>
              <a href={twitter} target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-x-twitter"></i>
              </a>
            </li>
            <li>
              <a href={linkedin} target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="team-content">
        <h4 className="title">{name}</h4>
        <span className="designation">{desig}</span>
        <span className="mail-at">
          <i className="tji-at"></i>
        </span>
      </div>
    </div>
  );
};

export default TeamCard;