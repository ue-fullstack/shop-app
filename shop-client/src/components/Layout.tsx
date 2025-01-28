import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';
import SwitchLanguage from './SwitchLanguage';
import { useAppContext } from '../context';

type Props = {
    children: JSX.Element;
};

const Layout = ({ children }: Props) => {
    const navigate = useNavigate();
    const { t } = useAppContext();

    const navItems = [
        { label: t('shops'), path: '/' },
        { label: t('products'), path: '/product' },
        { label: t('categories'), path: '/category' },
    ];

    return (
        <div>
            <AppBar component="nav">
                <Toolbar className="header">
                    <Typography variant="h6" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
                        {t('shopManagement')}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box>
                        {navItems.map((item) => (
                            <Button key={item.label} sx={{ color: '#fff' }} onClick={() => navigate(item.path)}>
                                {item.label}
                            </Button>
                        ))}
                    </Box>
                    <Box>
                        <SwitchLanguage />
                    </Box>
                </Toolbar>
            </AppBar>

            <Loader />
            <div>{children}</div>
        </div>
    );
};

export default Layout;
