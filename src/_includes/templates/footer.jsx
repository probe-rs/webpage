export default () => (
  <div className="footer-container">
    <footer className="footer">
      <ul className="footer-links">
        <li>
          <a href="https://matrix.to/#/#probe-rs:matrix.org">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
              <rect width="256" height="256" fill="none" />
              <path
                d="M45.15,230.11A8,8,0,0,1,32,224V64a8,8,0,0,1,8-8H216a8,8,0,0,1,8,8V192a8,8,0,0,1-8,8H82.5a8,8,0,0,0-5.15,1.88Z"
                opacity="0.2"
              />
              <path
                d="M45.15,230.11A8,8,0,0,1,32,224V64a8,8,0,0,1,8-8H216a8,8,0,0,1,8,8V192a8,8,0,0,1-8,8H82.5a8,8,0,0,0-5.15,1.88Z"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
              />
            </svg>
            Matrix
          </a>
        </li>
        <li>
          <a href="https://github.com/probe-rs/probe-rs">
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12">
              </path>
            </svg>
            Github
          </a>
        </li>
        <li>
          <a href="https://opencollective.com/probe-rs">
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12c2.54 0 4.894-.79 6.834-2.135l-3.107-3.109a7.715 7.715 0 1 1 0-13.512l3.107-3.109A11.943 11.943 0 0 0 12 0zm9.865 5.166l-3.109 3.107A7.67 7.67 0 0 1 19.715 12a7.682 7.682 0 0 1-.959 3.727l3.109 3.107A11.943 11.943 0 0 0 24 12c0-2.54-.79-4.894-2.135-6.834z">
              </path>
            </svg>
            Open Collective
          </a>
        </li>
        <li>
          <a rel="me" href="https://github.com/sponsors/probe-rs">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="44"
              height="44"
              fill="#000000"
              viewBox="0 0 256 256"
            >
              <path
                d="M224,64V192a8,8,0,0,1-8,8H82.5a8,8,0,0,0-5.15,1.88l-32.2,28.23A8,8,0,0,1,32,224V64a8,8,0,0,1,8-8H216A8,8,0,0,1,224,64Z"
                opacity="0.2"
              >
              </path>
              <path d="M216,48H40A16,16,0,0,0,24,64V224a15.84,15.84,0,0,0,9.25,14.5A16.05,16.05,0,0,0,40,240a15.89,15.89,0,0,0,10.25-3.78.69.69,0,0,0,.13-.11L82.5,208H216a16,16,0,0,0,16-16V64A16,16,0,0,0,216,48ZM40,224h0ZM216,192H82.5a16,16,0,0,0-10.3,3.75l-.12.11L40,224V64H216Z">
              </path>
            </svg>
            Github Sponsors
          </a>
        </li>
      </ul>
      <p className="footer-copyright">
        by the <a href="https://probe.rs/">probe-rs</a> contributors —{" "}
        <button
          className="button-theme"
          id="switch-theme"
          title="Toggle light & dark theme"
          aria-label="auto"
          aria-live="polite"
        >
          <span className="is-light">Light theme</span>
          <span className="is-dark">Dark theme</span>
        </button>
      </p>
    </footer>
  </div>
);
