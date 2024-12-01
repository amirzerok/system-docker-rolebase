import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Collapse,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Toolbar,
  Typography,
  CircularProgress,
  Backdrop,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import RoleIcon from '@mui/icons-material/AssignmentInd'; // این آیکون به عنوان مثال اضافه شده است.
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import AddIcon from '@mui/icons-material/Add';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // آیکون افزودن شخص
import PeopleIcon from '@mui/icons-material/People'; // آیکون مشاهده اشخاص
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'; // آیکون جدید برای مشاهده اشخاص
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'; // آیکون جدید برای چند نفر



const drawerWidth = 240;
const secAppbarHeight = 64;

const ToolbarOffest = styled('div', { name: 'ToolbarOffest' })(() => ({
  minHeight: secAppbarHeight,
}));

const AppBar2 = styled('div', { name: 'AppBar2' })(({ theme }) => ({
  display: 'flex',
  minHeight: secAppbarHeight,
  alignItems: 'center',
  paddingRight: '1.2rem',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
}));

interface MainContentProps {
  drawerOpen: boolean;
}

interface LayoutProps {
  children: ReactNode;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  userRole: string | null; // نقش کاربر
}

const MainContent = styled('div', {
  shouldForwardProp: (prop) => prop !== 'drawerOpen',
  name: 'MainContent',
})<MainContentProps>(({ theme, drawerOpen }) => ({
  zIndex: '3',
  width: '100%',
  marginRight: -drawerWidth,
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(drawerOpen && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  }),
}));

const PageContent = styled('div', { name: 'PageContent' })(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  height: 'fit-content',
}));

// کامپوننت برای نمایش اطلاعات پروفایل
const ProfileMenu: React.FC<{ userRole: string | null }> = ({ userRole }) => {
  const roleText = userRole === 'ADMIN' ? 'مدیر' : 'کاربر';

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6">نقش: {roleText}</Typography>
      {/* افزودن اطلاعات دیگر کاربر در اینجا */}
    </Box>
  );
};

export function Layout({ children, darkMode, setDarkMode, userRole }: LayoutProps) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [drawListOpen, setDrawListOpen] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    if (userRole) {
      console.log('User Role:', userRole);
    }
  }, [userRole]);

  const handleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const navigate = (path: string) => {
    router.push(path);
  };

  const handleDrawList = (event: React.SyntheticEvent, id: number) =>
    setDrawListOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));

  // فیلتر آیتم‌های منو بر اساس نقش کاربر
  const menuItems = [
    {
      text: 'داشبورد',
      id: 1,
      icon: <DashboardIcon />,
      path: '/',
    },
    {
      text: 'اشخاص',
      id: 3,
      icon: <PeopleOutlineIcon   />,
      path: false,
      sublists: [
        {
          text: 'شخص جدید',
          icon: <AddCircleOutlineIcon  />,
          path: '/newperson',
        },
        {
          text: 'مشاهده اشخاص',
          icon: <PersonOutlineIcon    />,
          path: '/viewperson',
        },
      ],
    },
    {
      text: 'کاربر',
      id: 4,
      icon: <PersonIcon  />,
      path: false,
      sublists: [
        {
          text: 'افزودن کاربر',
          icon: <PersonAddIcon  />,
          path: '/register',
        },
        {
          text: 'کاربران',
          icon: <GroupIcon  />,
          path: '/viewusers',
        },
      ],
    },
    {
      text: 'نقش ها ',
      id: 5,
      icon: <AddCircleIcon   />,
      path: false,
      sublists: [
        {
          text: 'نقش جدید  ',
          icon: <AddIcon   />,
          path: '/roles',
        },
        {
          text: 'مشاهده نقش ها ',
          icon: <RoleIcon  />,
          path: '/Viewrole',
        },
      ],
    },
    {
      text: ' اماکن ',
      id: 6,
      icon: <LocationOnIcon  />,
      path: false,
      sublists: [
        {
          text: 'مکان جدید  ',
          icon: <AddLocationIcon  />,
          path: '/newplace',
        },
        {
          text: 'مشاهده  اماکن ',
          icon: <LocationOnIcon  />,
          path: '/viewplace',
        },
      ],
    },
    {
      text: '  درس/ رشته/ کلاس  ',
      id: 7,
      icon: <AddCircleIcon   />,
      path: false,
      sublists: [
        {
          text: 'ایجاد کلاس   ',
          icon: <AddIcon   />,
          path: '/createclass',
        },
        {
          text: ' ایجاد درس    ',
          icon: <AddIcon  />,
          path: '/createdars',
        },
        {
          text: ' ایجاد رشته / پایه    ',
          icon: <AddIcon  />,
          path: '/createreshrte',
        },
        {
          text: 'مشاهده کلاس ها  ',
          icon: <AddIcon />,
          path: '/viewclass',
        },
        {
          text: 'مشاهده رشته ها ',
          icon: <AddIcon />,
          path: '/viewreshte',
        },
        
      ],
    },
    {
      text: ' دوربین آنلاین ',
      id: 8,
      icon: <LocationOnIcon  />,
      path: false,
      sublists: [
        {
          text: 'کلاس یک  ',
          icon: <AddLocationIcon  />,
          path: '/onlinecam/class1',
        },
        {
          text: 'کلاس  دو ',
          icon: <LocationOnIcon  />,
          path: '/onlinecam/class2',
        },
        {
          text: 'کلاس  سه ',
          icon: <LocationOnIcon  />,
          path: '/onlinecam/class3',
        },
        {
          text: 'کلاس  چهار ',
          icon: <LocationOnIcon  />,
          path: '/onlinecam/class4',
        },
        {
          text: 'کلاس  پنج ',
          icon: <LocationOnIcon  />,
          path: '/onlinecam/class5',
        },
        {
          text: 'کلاس  شیش ',
          icon: <LocationOnIcon  />,
          path: '/onlinecam/class6',
        },
      ],
    },
  ];

  // فیلتر کردن آیتم‌های منو برای نقش 'USER'
  const filteredMenuItems =
    userRole === 'user'
      ? menuItems.filter((item) => item.id !== 3 && item.id !== 4)
      : menuItems;

  const toggleTheme = () => {
    setLoading(true);
    setTimeout(() => {
      setDarkMode(!darkMode);
      setLoading(false);
    }, 500);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.replace('/').then(() => {
      window.location.href = '/'; // اطمینان از بارگذاری کامل صفحه
    });
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileNavigation = (path: string) => {
    handleMenuClose();
    router.push(path);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row-reverse',
        height: '100%',
      }}
      component="div"
    >
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* First Appbar */}
      <AppBar
        elevation={0}
        sx={{
          backgroundColor: darkMode ? '#121212' : '#304967',
        }}
      >
        <Toolbar>
          <Typography sx={{ display: 'inline-block', margin: 1 }}>
            هنرستان جوار نفت
          </Typography>
          <IconButton
            sx={{ margin: 0.2 }}
            color="inherit"
            aria-label="drawerOpen drawer"
            onClick={handleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            {loading ? (
              <CircularProgress color="inherit" size={24} />
            ) : (
              <IconButton
                sx={{ marginLeft: 0.5 }}
                color="inherit"
                aria-label="toggle dark mode"
                onClick={toggleTheme}
              >
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              sx={{ marginLeft: 0.5 }}
              color="inherit"
              aria-label="user profile"
              onClick={handleMenuOpen}
            >
              <AccountCircleIcon />
            </IconButton>
            {userRole && (
              <Typography variant="body1" sx={{ color: '#fff', marginLeft: 2 }}>
                {userRole === 'ADMIN' ? 'مدیر' : 'کاربر'}
              </Typography>
            )}
            <IconButton
              sx={{ marginLeft: '0.5rem' }}
              color="inherit"
              aria-label="logout"
              onClick={handleLogout}
            >
              <ExitToAppIcon />
            </IconButton>
          </Box>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <ProfileMenu userRole={userRole} />
            <MenuItem onClick={() => handleProfileNavigation('/profile')}>
              <Typography variant="body1">مشخصات کاربری</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <MainContent drawerOpen={drawerOpen}>
        {/* محتوای صفحه */}
        <ToolbarOffest />

        {/* Second Appbar */}
        <AppBar2 sx={{ position: 'sticky' }}>
          <IconButton color="primary" onClick={handleDrawer}>
            {drawerOpen ? (
              <ArrowForwardIcon sx={{ ml: '1rem', fontSize: '1.2rem' }} />
            ) : (
              <ArrowBackIcon sx={{ ml: '1rem', fontSize: '1.2rem' }} />
            )}
          </IconButton>
          <Typography sx={{ fontSize: '1.2rem' }}> </Typography>
        </AppBar2>

        {/* اطلاعات صفحه */}
        <PageContent>{children}</PageContent>
      </MainContent>

      {/* Drawer */}
      <Drawer
        variant="persistent"
        anchor="right"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
            color: darkMode ? '#ffffff' : '#000000',
          },
          zIndex: 2,
        }}
        open={drawerOpen}
      >
        <ToolbarOffest />
        <List
  component="nav"
  sx={{
    '& .MuiListItemButton-root': {
      textAlign: 'right',
    },
  }}
>
  {filteredMenuItems.map((item) => (
    <React.Fragment key={item.id}>
      <ListItemButton 
        onClick={(e) => {
          if (item.path === '/') {
            navigate('/'); // هدایت به داشبورد
          } else {
            handleDrawList(e, item.id); // برای آیتم‌های دیگر
          }
        }}
      >
        <ListItemIcon>
          {React.cloneElement(item.icon, { sx: { color: darkMode ? '#b0bec5' : '#607d8b' } })}
        </ListItemIcon>
        <ListItemText primary={item.text} />
        {item.sublists ? (drawListOpen[item.id] ? <ExpandLess /> : <ExpandMore />) : null}
      </ListItemButton>
      {item.sublists && (
        <Collapse in={drawListOpen[item.id]} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.sublists.map((subItem, index) => (
              <ListItemButton
                key={index}
                sx={{ pl: 4 }}
                onClick={() => navigate(subItem.path)}
                selected={router.pathname === subItem.path}
              >
                <ListItemIcon>
                  {React.cloneElement(subItem.icon, { sx: { color: darkMode ? '#b0bec5' : '#607d8b' } })}
                </ListItemIcon>
                <ListItemText primary={subItem.text} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      )}
    </React.Fragment>
  ))}
</List>
      </Drawer>
    </Box>
  );
}

export default Layout;
