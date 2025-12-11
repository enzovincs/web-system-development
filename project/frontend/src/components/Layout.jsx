import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();
  const isDashboard = location.pathname === '/' || location.pathname === '';
  
  // Valores posibles: 'type', 'priority_desc', 'date_prox', 'alpha_asc', etc.
  const [sortBy, setSortBy] = useState('type');

  return (
    <div className="app-root">
      {/* BARRA SUPERIOR */}
      <header className="topbar">
        <div className="topbar-left">
          <div className="topbar-logo">TM</div>
          <div className="topbar-title-block">
            <h1 className="topbar-title">Task Manager</h1>
          </div>
        </div>

        <div className="topbar-right">
          <Link to="/" className={`topbar-link ${isDashboard ? 'topbar-link--active' : ''}`}>
            Tasks
          </Link>
          <Link to="/about" className={`topbar-link ${!isDashboard ? 'topbar-link--active' : ''}`}>
            About
          </Link>
        </div>
      </header>

      <div className="app-body">
        {/* SIDEBAR  */}
        <aside className="sidebar">
          <section className="sidebar-section">
            <h3 className="sidebar-heading">Task views</h3>
            <ul className="sidebar-list">
              
              {/* Opción: All tasks  */}
              <li 
                className={`sidebar-item ${sortBy === 'date_prox' ? 'sidebar-item--active' : ''}`}
                onClick={() => setSortBy('date_prox')}
                style={{cursor: 'pointer'}}
              >
                <span className="sidebar-bullet sidebar-bullet--green" />
                <span>All tasks</span>
              </li>

              {/* Opción: By type (Columnas) */}
              <li 
                className={`sidebar-item ${sortBy === 'type' ? 'sidebar-item--active' : ''}`}
                onClick={() => setSortBy('type')}
                style={{cursor: 'pointer'}}
              >
                <span className="sidebar-bullet sidebar-bullet--blue" />
                <span>By type</span>
              </li>

              {/* Opción: By priority */}
              <li 
                className={`sidebar-item ${sortBy === 'priority_desc' ? 'sidebar-item--active' : ''}`}
                onClick={() => setSortBy('priority_desc')}
                style={{cursor: 'pointer'}}
              >
                <span className="sidebar-bullet sidebar-bullet--purple" />
                <span>By priority</span>
              </li>

               {/* Opción: A-Z */}
               <li 
                className={`sidebar-item ${sortBy === 'alpha_asc' ? 'sidebar-item--active' : ''}`}
                onClick={() => setSortBy('alpha_asc')}
                style={{cursor: 'pointer'}}
              >
                <span className="sidebar-bullet" style={{background: '#ccc'}} />
                <span>A-Z</span>
              </li>

            </ul>
          </section>
        </aside>

        <main className="app-content">
          {/* AQUÍ PASAMOS EL ESTADO AL Dashboard */}
          <Outlet context={{ sortBy, setSortBy }} />
        </main>
      </div>
    </div>
  );
};

export default Layout;