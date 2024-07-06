import styles from './Loading.module.css';

export const ContetLoading = () => {
  return (
    <div className={styles.contentFrame}>
      <div className={styles.loader} />
    </div>
  );
};
