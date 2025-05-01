import logo from '../../../assets/nreax.svg'

const AppLogo = () => {
    return (
        <div className="flex items-center gap-3 px-4 pt-4">
            <img src={logo} alt="NReaxChat logo" className="w-16 h-16 rounded-22"/>
            <span className="text-2xl font-semibold">NReaxChat</span>
        </div>
    );
};

export default AppLogo;