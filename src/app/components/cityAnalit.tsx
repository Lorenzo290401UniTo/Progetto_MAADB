"use client";

export default function CityAnaliticBox(props: {cityName: string, maleNum: string, femaleNum: string}) {

    return (
        <div className="flex flex-col gap-[5px] bg-[white] p-[15px] rounded-[12px] border-[1px] border-[black]">
            <p style={{ fontWeight: "bold", margin: 0, textAlign: "center"}}>{props.cityName}</p>
            <span>Maschi: {props.maleNum}</span>
            <span>Femmine: {props.femaleNum}</span>
        </div>
    )
}