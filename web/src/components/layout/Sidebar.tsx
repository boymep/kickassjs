import { List, ListItemButton, ListItemIcon, ListItemText, Divider, ListSubheader } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import TagIcon from '@mui/icons-material/Tag';
import LayersIcon from '@mui/icons-material/Layers';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import HomeIcon from '@mui/icons-material/Home';
import PsychologyIcon from '@mui/icons-material/Psychology';
import DescriptionIcon from '@mui/icons-material/Description';
import WarningIcon from '@mui/icons-material/Warning';
import { topics } from '../../data/topics';

const iconMap: Record<string, React.ReactElement> = {
  Search: <SearchIcon />,
  CompareArrows: <CompareArrowsIcon />,
  ViewColumn: <ViewColumnIcon />,
  Tag: <TagIcon />,
  Layers: <LayersIcon />,
  AccountTree: <AccountTreeIcon />,
};

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();

  const go = (path: string) => {
    navigate(path);
    onClose?.();
  };

  return (
    <List>
      <ListItemButton selected={location.pathname === '/'} onClick={() => go('/')}>
        <ListItemIcon><HomeIcon /></ListItemIcon>
        <ListItemText primary="Главная" />
      </ListItemButton>
      <Divider sx={{ my: 1 }} />
      <ListSubheader sx={{ bgcolor: 'transparent' }}>Алгоритмы</ListSubheader>
      {topics.map((t) => (
        <ListItemButton
          key={t.id}
          selected={location.pathname.startsWith(`/topic/${t.slug}`)}
          onClick={() => go(`/topic/${t.slug}/theory`)}
        >
          <ListItemIcon>{iconMap[t.icon]}</ListItemIcon>
          <ListItemText primary={t.title} />
        </ListItemButton>
      ))}
      <Divider sx={{ my: 1 }} />
      <ListSubheader sx={{ bgcolor: 'transparent' }}>Дополнительно</ListSubheader>
      <ListItemButton selected={location.pathname === '/pattern-game'} onClick={() => go('/pattern-game')}>
        <ListItemIcon><PsychologyIcon /></ListItemIcon>
        <ListItemText primary="Определи паттерн" />
      </ListItemButton>
      <ListItemButton selected={location.pathname === '/cheatsheet'} onClick={() => go('/cheatsheet')}>
        <ListItemIcon><DescriptionIcon /></ListItemIcon>
        <ListItemText primary="Шпаргалка" />
      </ListItemButton>
      <ListItemButton selected={location.pathname === '/js-pitfalls'} onClick={() => go('/js-pitfalls')}>
        <ListItemIcon><WarningIcon /></ListItemIcon>
        <ListItemText primary="JS-ловушки" />
      </ListItemButton>
    </List>
  );
}
