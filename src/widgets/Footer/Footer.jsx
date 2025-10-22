import { Typography } from '@src/shared/ui';
import styles from './Footer.module.scss';

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.inner}>
          <Typography variant="smallT" className={styles.text}>
            © {year} Shop. All rights reserved.
          </Typography>
        </div>
      </div>
    </footer>
  );
};
