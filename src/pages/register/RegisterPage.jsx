import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Typography } from '@src/shared/ui';
import { paths } from '@src/shared/constants/constants';
import { useAuth } from '@src/shared/hooks/useAuth';
import { useState } from 'react';
import styles from './RegisterPage.module.scss';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser, setJustRegistered } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    setError('');
    try {
      await registerUser({ username: data.username, password: data.password });
      setJustRegistered(true);
      navigate(paths.login);
    } catch (err) {
      setError(
        `Ошибка регистрации: ${
          err.response?.data?.message || 'Неизвестная ошибка'
        }`,
      );
    }
  };

  return (
    <section className={styles.auth}>
      <div className={styles.container}>
        <div className={styles.card}>
          <Typography variant="h3" weight="bold" className={styles.title}>
            Регистрация
          </Typography>

          {error && (
            <Typography variant="smallT" color="error" className={styles.error}>
              {error}
            </Typography>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <label className={styles.field}>
              <Typography variant="smallT" className={styles.label}>
                Имя пользователя
              </Typography>
              <input
                type="text"
                className={styles.input}
                {...register('username', {
                  required: 'Введите имя пользователя',
                  minLength: {
                    value: 3,
                    message: 'Минимум 3 символа',
                  },
                })}
              />
              {errors.username && (
                <Typography
                  variant="smallT"
                  color="error"
                  className={styles.fieldError}
                >
                  {errors.username.message}
                </Typography>
              )}
            </label>

            <label className={styles.field}>
              <Typography variant="smallT" className={styles.label}>
                Пароль
              </Typography>
              <input
                type="password"
                className={styles.input}
                {...register('password', {
                  required: 'Введите пароль',
                  minLength: {
                    value: 6,
                    message: 'Минимум 6 символов',
                  },
                })}
              />
              {errors.password && (
                <Typography
                  variant="smallT"
                  color="error"
                  className={styles.fieldError}
                >
                  {errors.password.message}
                </Typography>
              )}
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.submit}
            >
              <Typography variant="buttonT">
                {isSubmitting ? 'Создаем...' : 'Создать аккаунт'}
              </Typography>
            </button>
          </form>

          <Typography variant="smallT" className={styles.footer}>
            Уже есть аккаунт?{' '}
            <Link to={paths.login} className={styles.link}>
              Войти
            </Link>
          </Typography>
        </div>
      </div>
    </section>
  );
};
