"use client";

export default function ForumsListBox(props: {user: string, forums: string[]}) {

    return (
        <div className="w-[calc(100% - 30px)] flex flex-col gap-[5px] bg-[white] p-[15px] rounded-[12px] border-[1px] border-[black]">
            <p className="text-[20px]" style={{ fontWeight: "bold", margin: 0 }}>{props.user}</p>
            <div className="flex flex-wrap">
            {
                props.forums.map((element, index) => (
                    <div key={index} className="bg-[#ADD8E6] border-[1px] m-[5px] border-[black] p-[10px] whitespace-nowrap">
                        {element}
                    </div>
                ))
            }
            </div>
        </div>
    )
}