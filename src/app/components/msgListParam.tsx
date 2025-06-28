"use client";

export default function MsgListBox(props: {user: string, msgs: any[]}) {

    return (
        <div className="w-[calc(100% - 30px)] flex flex-col bg-[white] gap-[5px] p-[15px] rounded-[12px] border-[1px] border-[black]">
            <p className="text-[20px]" style={{ fontWeight: "bold", margin: 0 }}>{props.user}</p>
            <div className="flex flex-wrap gap-[10px]">
            {
                props.msgs.map((element, index) => (
                    <div key={index} className="max-w-[400px] flex flex-col justify-between gap-[5px] bg-[#ADD8E6] p-[10px] rounded-[10px] border-[1px] border-[black] overflow-hidden" style={{ fontWeight: "normal" }}>
                        <p className="m-[0px] whitespace-nowrap truncate">{element.content}</p>
                        <p className="m-[0px] text-[14px] text-[grey]">{element.id}</p>
                    </div>
                ))
            }
            </div>
        </div>
    )
}