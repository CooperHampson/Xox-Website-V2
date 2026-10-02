import './ModeratorSection.css';

export function ModeratorSection() {
  function handleOpenDesignStudio() {
    window.open('/design-studio', '_blank', 'noopener,noreferrer');
  }

  return (
    <section>
      <div className="moderator-section-container">
        <p className="moderator-info-title">Moderator</p>

        <div className="moderator-section-inner-cont">
          <button
            type="button"
            onClick={handleOpenDesignStudio}
            className="open-design-studio-button"
          >
            Design Studio
          </button>
        </div>
      </div>
    </section>
  );
}