import { useEffect, useRef, useState } from 'react';
import { AuthProvider } from '../../types/public';

export interface LoginPopupProps {
  provider: AuthProvider;
  visible: boolean;
  onClose?: () => void;
  onCode: (code: string, state: string, provider: AuthProvider) => void;
  link?: boolean;
}

/**
 * Creates an external login popup and listens for a success
 * @param props The props for the login popup
 */
export function AuthAccountExternalLoginPopup({
  provider, visible, onClose, onCode, link,
}: LoginPopupProps) {
  const [externalWindow, setExternalWindow] = useState<Window | null>(null);
  const interval = useRef<number>();

  useEffect(() => {
    if (visible) {
      if (externalWindow) {
        externalWindow.focus();
      } else {
        const width = 600;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        const title = 'Log In';

        const url = `/auth/${provider}/${link ? 'link' : 'login'}`;

        const win = window.open(url, title, `width=${width},height=${height},left=${left},top=${top}`);
        setExternalWindow(win);
      }
    }
  }, [visible]);

  useEffect(() => {
    if (externalWindow) {
      interval.current = window.setInterval(() => {
        try {
          const curUrl = externalWindow?.location.href;
          const params = new URL(curUrl).searchParams;
          const code = params.get('code');
          const state = params.get('state') ?? (link ? 'link' : 'login');
          if (!code) { return; }
          onCode(code, state, provider);
          window.clearInterval(interval.current);
          externalWindow.close();
          setExternalWindow(null);
        } catch (e) {
          //
          console.log(e);
        } finally {
          if (!externalWindow || externalWindow.closed) {
            if (onClose) { onClose(); }
            window.clearInterval(interval.current);
            setExternalWindow(null);
          }
        }
      }, 500);
    }
  }, [externalWindow]);

  return (null);
}

AuthAccountExternalLoginPopup.defaultProps = {
  link: false,
};
