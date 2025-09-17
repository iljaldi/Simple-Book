import { useState, useEffect } from 'react';

export const useCapsLock = () => {
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Caps Lock 키 감지
      if (event.getModifierState && event.getModifierState('CapsLock')) {
        setIsCapsLockOn(true);
      } else {
        setIsCapsLockOn(false);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      // Caps Lock 키를 눌렀을 때
      if (event.key === 'CapsLock') {
        setIsCapsLockOn(event.getModifierState('CapsLock'));
      }
    };

    // 이벤트 리스너 등록
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('keyup', handleKeyUp);

    // 초기 상태 확인
    const checkInitialState = () => {
      // 가상의 키 이벤트로 현재 Caps Lock 상태 확인
      const testEvent = new KeyboardEvent('keydown', { key: 'a' });
      if (testEvent.getModifierState && testEvent.getModifierState('CapsLock')) {
        setIsCapsLockOn(true);
      }
    };

    checkInitialState();

    // 정리 함수
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return isCapsLockOn;
};
