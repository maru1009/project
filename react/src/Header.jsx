import './Header.css'

function Header(){ 
    return(
        <>
            <div className="header-section">
                <div className='first-section'>
                    <ul>
                        <li>Logo</li>
                        <li>Users</li>
                        <li>Teams</li>
                        <li>Scoreboard</li>
                        <li>Challenges</li>
                    </ul>
                </div>
                <div className='second-section'>
                    <ul>
                        <li>Team</li>
                        <li>Profile</li>
                        <li>Settings</li>
                        <li>Logout</li>
                    </ul>
                </div>

                
            </div>
        </>
    ); 

}

export default Header