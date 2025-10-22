import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Typography } from '@src/shared/ui';
import { paths } from '@src/shared/constants/constants';
import { useAuth } from '@src/shared/hooks/useAuth';
import styles from './LoginPage.module.scss';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuth } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await login({ username: form.username, password: form.password });
      navigate(paths.homePage);
    } catch (err) {
      setError(`Неверный логин или пароль:${err.response?.data?.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (isAuth) return null;

  return (
    <section className={styles.auth}>
      <div className={styles.container}>
        <div className={styles.card}>
          <Typography variant="h3" weight="bold" className={styles.title}>
            Вход
          </Typography>

          {error && (
            <Typography variant="smallT" color="error" className={styles.error}>
              {error}
            </Typography>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.field}>
              <Typography variant="smallT" className={styles.label}>
                Имя пользователя
              </Typography>
              <input
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </label>

            <label className={styles.field}>
              <Typography variant="smallT" className={styles.label}>
                Пароль
              </Typography>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className={styles.submit}
            >
              <Typography variant="buttonT">
                {submitting ? 'Входим...' : 'Войти'}
              </Typography>
            </button>
          </form>

          <Typography variant="smallT" className={styles.footer}>
            Нет аккаунта?{' '}
            <Link to={paths.register} className={styles.link}>
              Зарегистрироваться
            </Link>
          </Typography>
        </div>
      </div>
    </section>
  );
};
