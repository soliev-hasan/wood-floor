import React from "react";
import "./TeamMember.css";

interface TeamMemberProps {
  name: string;
  position: string;
  image: string;
  description: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({
  name,
  position,
  image,
  description,
}) => {
  return (
    <div className="team-member">
      <div className="member-image">
        <img src={image} alt={name} />
      </div>
      <div className="member-info">
        <h3>{name}</h3>
        <span className="position">{position}</span>
        <p>{description}</p>
        <div className="social-links">
          <a href="#" className="social-link">
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="#" className="social-link">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="social-link">
            <i className="fas fa-envelope"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default TeamMember;
