import React from "react";

type Props = {
    account: string,
    password: string;
    saltedPassword: string,
    onChangePassword: (value: string) => void;
};

const Password = (props: Props) => {

    const {
        account,
        password,
        saltedPassword,
        onChangePassword,
    } = props;

    // const [hasSeenToast, setHasSeenToast] = useState(false);

    return (
        <div className="w-full max-w-sm mx-auto">
            <textarea
                placeholder="Enter a message for your recipient!"
                value={password}
                onChange={(event) => onChangePassword(event.target.value)}
                // onFocus={() => {
                  //   if (!hasSeenToast) {
                 //        toast.info("Be careful with this message! Anyone can use this message to claim your gift.");
                   //      setHasSeenToast(true);
                 //    }
               //  }}
                className="w-full p-2 border rounded-md border-gray-300 text-center"
            />
            <details
                className={password ? 'block' : 'hidden'}>
                <summary className="text-sm text-center">
                    {"View gift secret"}
                </summary>
                <div
                    className="flex flex-col p-2 text-center"
                    style={{ border: "1px solid #ccc", borderRadius: 8 }}>
                    <p className="text-sm fw-bold">
                        {"Secret phrase to claim gift:"}
                    </p>
                    <div className="flex items-center gap-2">
                        <code className="flex-1 text-xs p-2 bg-gray-100 rounded-md overflow-x-auto whitespace-nowrap">
                            {saltedPassword}
                        </code>
                        <button
                            onClick={() => {
                                void navigator.clipboard.writeText(saltedPassword);
                                // toast.success('Copied to clipboard!');
                            }}
                            className="p-2 text-gray-600 hover:text-gray-900">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        </button>
                    </div>
                    <p className="text-xs mt-2 p-2 bg-blue-100 text-blue-800 rounded-md">
                        {"The secret phrase is used to claim your gift. Keep it safe! It is created using your message and a random string. If you lose it, you can reclaim your gift in the "}
                        <a
                            className="fw-bold"
                            href={`https://www.onchaingift.com/from/${account}`}
                            rel="noopener noreferrer nofollow"
                            target="_blank">
                            {"Gifts From Me"}
                        </a>
                        {" page."}
                    </p>
                </div>
            </details>
        </div>
    );
};

export default Password;
