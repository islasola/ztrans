import { useState, useCallback, useEffect, useRef } from 'react';
import { BlockitClient, BlockType, BlockSnapshot, DocumentRef } from '@lark-opdev/block-docs-addon-api';
import './index.css';

const DocMiniApp = new BlockitClient().initAPI();
const isTextualBlock = (block: BlockSnapshot) => {
  return (
    block.type === BlockType.TEXT ||
    block.type.includes('heading') ||
    block.type === BlockType.BULLET ||
    block.type === BlockType.ORDERED ||
    block.type === BlockType.QUOTE ||
    block.type === BlockType.TODO
  );
};
const getDocumentWordCount = async (docRef: DocumentRef) => {
  const blockSnapshot = await DocMiniApp.Document.getRootBlock(docRef);
  let number = 0;
  const getBlockWordCount = async (blockSnapshot: BlockSnapshot): Promise<void> => {
    if (isTextualBlock(blockSnapshot)) {
      number = number + blockSnapshot.data?.plain_text?.length;
    }
    for (const blockChildSnapshot of blockSnapshot.childSnapshots) {
      await getBlockWordCount(blockChildSnapshot);
    }
  };
  await getBlockWordCount(blockSnapshot);
  return number;
};

export default () => {
  const [count, setCount] = useState<number>(0);
  const interval = useRef<number>(new Date().getTime());
  const docRef = useRef<DocumentRef>(null);
  const computeCount = useCallback(async (docRef: DocumentRef) => {
    let number = await getDocumentWordCount(docRef);
    setCount(number);
  }, []);
  const INTERVAL = 16;

  useEffect(() => {
    (async () => {
      //获取文档引用
      docRef.current = await DocMiniApp.getActiveDocumentRef();
      //监听文档变化
      DocMiniApp.Selection.onSelectionChange(docRef.current, () => {
        let now = new Date().getTime();
        if (now - interval.current > INTERVAL) {
          computeCount(docRef.current);
          interval.current = now;
        }
      });
      //初始化
      computeCount(docRef.current);
    })();
    return () => {
      (async () => {
        DocMiniApp.Selection.offSelectionChange(docRef.current, () => {});
      })();
    };
  }, []);

  return (
    <div className="wordcount-demo">
      <h2>
        当前文档字数为：<span className="count">{count} </span>个
      </h2>
    </div>
  );
};
