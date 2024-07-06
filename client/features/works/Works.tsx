import { EntityId } from 'api/@types/brandedId';
import { WorkEntity } from 'api/@types/work';
import { ContetLoading } from 'components/loading/Content.Loading';
import { Loading } from 'components/loading/Loading';
import { useCatchApiErr } from 'hooks/useCatchApiErr';
import type { FormEvent } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { apiClient } from 'utils/apiClient';
import styles from './Works.module.css';

type ContentDict = Record<EntityId['work'], string | undefined>;

const MainContent = (props: { work: WorkEntity; contentDict: ContentDict }) => {
  switch (props.work.status) {
    case 'loading':
      return (
        <div style={{ height: '500px' }}>
          <ContetLoading />
        </div>
      );

    case 'completed':
      return (
        <div className={styles.imageFrame}>
          <img src={props.work.imageUrl} alt={props.work.title} className={styles.workImage} />
          <div
            className={styles.contentText}
            dangerouslySetInnerHTML={{
              __html: props.contentDict[props.work.id] ?? '',
            }}
          />
        </div>
      );
    case 'failed':
      return <div>{props.work.errorMsg}</div>;
    /* v8 ignore next 2 */
    default:
      throw new Error(props.work satisfies never);
  }
};

export const Works = () => {
  const catchApiErr = useCatchApiErr();
  const [works, setWorks] = useState<WorkEntity[]>();
  const [contentDict, setContentDict] = useState<ContentDict>({});
  const [novelUrl, setNovelUrl] = useState('');
  const fetchContent = useCallback(async (w: WorkEntity) => {
    const content = await fetch(w.contentUrl).then((b) => b.text());
    setContentDict((dict) => ({ ...dict, [w.id]: content }));
  }, []);
  const createWork = async (e: FormEvent) => {
    e.preventDefault();
    setNovelUrl('');

    const work = await apiClient.private.works
      .$post({
        body: { novelUrl },
      })
      .catch(catchApiErr);

    if (work !== null && works?.every((w) => w.id !== work.id)) {
      setWorks((works) => [work, ...(works ?? [])]);
    }
  };

  useEffect(() => {
    if (works !== undefined) return;

    apiClient.private.works
      .$get()
      .then((ws) => {
        setWorks(ws);
        return Promise.all(ws.map(fetchContent));
      })
      .catch(catchApiErr);
  }, [catchApiErr, works, contentDict, fetchContent]);

  if (!works) return <Loading visible />;

  return (
    <div className={styles.main}>
      <div className={styles.card}>
        <form className={styles.form} onSubmit={createWork}>
          <input
            value={novelUrl}
            className={styles.textInput}
            type="text"
            placeholder="青空文庫の作品ページURL"
            onChange={(e) => setNovelUrl(e.target.value)}
          />
          <div className={styles.controls}>
            <input className={styles.btn} disabled={novelUrl === ''} type="submit" value="CREATE" />
          </div>
        </form>
      </div>
      {works.map((work) => (
        <div key={work.id} className={styles.card}>
          <MainContent work={work} contentDict={contentDict} />
          <div className={styles.form}>
            <div className={styles.controls}>
              <span>
                {work.title} - {work.author}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

//warota
