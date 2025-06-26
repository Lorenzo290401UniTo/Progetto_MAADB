"use client";

export default function MsgParamBox(props: {user: string, msg: string}) {

    return (
        <div className="flex flex-col gap-[5px] bg-[#ADD8E6] p-[15px] rounded-[12px] border-[1px] border-[black]">
            <p style={{ fontWeight: "bold", margin: 0 }}>{props.user}</p>
            <div className="flex-grow">
                <p className="m-[0px]">{props.msg.split("(###)")[1]}</p>
            </div>
            <div className="w-full flex items-center justify-between text-[grey] text-[14px] mt-[10px]">
                <p className="m-[0px]">{props.msg.split("(###)")[0]}</p>
                <p className="m-[0px]">{props.msg.split("(###)")[2]}</p>
            </div>
        </div>
    )
}