import React, { useEffect, useState } from "react";
import { Space } from "antd"
import { CheckCircleTwoTone } from '@ant-design/icons'

const GuestsList = () => {

  const [guests, setGuests] = useState([])
  const [diet, setDiet] = useState([])
  const [common, setCommon] = useState([])

  const getCommonStateFunc = (arr, arr1) => {
    let arr2 = []
    for (let i = 0; i < arr.length; i++) {
      arr2.push({
        name: arr[i].name,
        eatsPizza: arr[i].eatsPizza,
        isVegan: arr1[i].isVegan,
        formInfo: {}
      })
    }
    return arr2
  }

  const requestGuests = async() => {
    fetch(`https://gp-js-test.herokuapp.com/pizza/guests`)
      .then(response => response.json())
      .then(data => {
        setGuests(data.party)
      })
  }

  const requestDiet = async(guests, queryStr) => {
    if (guests.length === 0) {
      requestDiet(guests, queryStr)
    } else {
      fetch(`https://gp-js-test.herokuapp.com/pizza/world-diets-book/${queryStr}`)
        .then(response => response.json())
        .then(data => {
          setDiet(data.diet)
        })
    }
  }
    // guests.map(guest => guest.name).join(",").split(" ").join("%20")

    useEffect(() => {

      requestGuests()
      requestDiet(guests, guests.map(guest => guest.name).join(",").split(" ").join("%20") )
      setCommon(getCommonStateFunc(guests, diet))

    }, [guests])

    // onClick={<Navigate to={`/${common[i].name.split(" ").join("")}`} />}


    const renderList = (common) => {
      for (let i = 0; i < common.length; i++) {
        if (common.eatsPizza === false) {
          return <div style={{ color: "gray" }}>{common[i].name}</div>
        } else if (common[i].eatsPizza === true && common[i].formInfo.feedback.length === 0) {
          return <div style={{ color: "black" }} >{common[i].name}</div>
        } else if (common[i].eatsPizza === true && common[i].formInfo.feedback.length > 0) {
          return <div style={{ color: "black" }} ><Space><CheckCircleTwoTone twoToneColor="#52c41a" /></Space>{common[i].name}</div>
        } else if (common[i].eatsPizza === true && common[i].formInfo.feedback.length === 0 && diet[i].isVegan === true) {
          return <div style={{ color: "limegreen" }} >{common[i].name}</div>
        } else if (common[i].eatsPizza === true && common[i].formInfo.feedback.length > 0 && diet[i].isVegan === true) {
          return <div style={{ color: "limegreen" }} ><Space><CheckCircleTwoTone twoToneColor="#52c41a" /></Space>{common[i].name}</div>
        } else {
          return null
        }
      }
      console.log(guests)
      console.log(diet)
      console.log(common)
    }



    return (
      <div>
        {renderList(common)}
      </div>
    )
  }

  export default GuestsList