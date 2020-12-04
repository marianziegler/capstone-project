import styled from 'styled-components/macro'

import Slider from 'rc-slider' 
import 'rc-slider/assets/index.css'
import { useState } from 'react'

import { loadToken } from '../../services/tokenStorage'

export default function ProfilePage({userData}) {

    const [sliderValues, setSliderValues] = useState({
        weightGender: userData.weightGender === null ? 2 : userData.weightGender,
        weightEnvironment: userData.weightEnvironment === null ? 2 : userData.weightEnvironment,
        weightLgbtq: userData.weightLgbtq === null ? 2 : userData.weightLgbtq,
        weightCorruption: userData.weightCorruption === null ? 2 : userData.weightCorruption,
        weightEquality: userData.weightEquality === null ? 2 : userData.weightEquality,
        weightFreedom: userData.weightFreedom === null ? 2 : userData.weightFreedom
    })

    return  (
        <Wrapper>
            <Heading>Profile Page</Heading>
            <ContentContainer>
                <SubHeading>You are logged in as:</SubHeading>
                <p>Name: {userData.firstName} {userData.lastName}</p>
                <p>E-Mail: {userData.email}</p>
            </ContentContainer>
            <ContentContainer>
                <SubHeading>Your settings:</SubHeading>
                <p>Environment and Climate</p>
                <Slider 
                    min={0} 
                    max={4} 
                    defaultValue={userData.weightEnvironment === null ? 2 : userData.weightEnvironment}
                    onChange={(event) => onSliderChange(event, "weightEnvironment")}
                />
                <p>Gender Equality</p>
                <Slider 
                    min={0} 
                    max={4} 
                    defaultValue={userData.weightGender === null ? 2 : userData.weightGender}
                    onChange={(event) => onSliderChange(event, "weightGender")}
                    />
                <p>LGBTQ-Acceptance</p>
                <Slider 
                    min={0} 
                    max={4} 
                    defaultValue={userData.weightLgbtq === null ? 2 : userData.weightLgbtq}
                    onChange={(event) => onSliderChange(event, "weightLgbtq")}
                    />
                <p>Freedom and Democracy</p>
                <Slider 
                    min={0} 
                    max={4} 
                    defaultValue={userData.weightFreedom === null ? 2 : userData.weightFreedom}
                    onChange={(event) => onSliderChange(event, "weightFreedom")}    
                />
                <p>Corruption Control</p>
                <Slider 
                    min={0} 
                    max={4} 
                    defaultValue={userData.weightCorruption === null ? 2 : userData.weightCorruption}
                    onChange={(event) => onSliderChange(event, "weightCorruption")}
                    />
                <p>Income Equality</p>
                <Slider 
                    min={0} 
                    max={4} 
                    defaultValue={userData.weightEquality === null ? 2 : userData.weightEquality}
                    onChange={(event) => onSliderChange(event, "weightEquality")}
                    />
                <button onClick={submitPrefs}>Submit!</button>
            </ContentContainer>
        </Wrapper>
    )

    function onSliderChange (value, entry) {
        setSliderValues({
            ...sliderValues,
            [entry]: value
        })
    }

    function submitPrefs () {
        fetch('http://countrycheck.local/user_update', {
            headers: {
                Authorization: `Bearer ${loadToken()}`
            },
            method: 'post',
            body: JSON.stringify(sliderValues) 
        }).then(response => response.json())
        .then(data => console.log(data))
    }
}

const Wrapper = styled.div`
    margin: 10px;
    width: 355px;
`

const ContentContainer = styled.div`
    border: 1px solid black;
    border-radius: 5px;
    padding: 1em;
    margin-bottom: 10px;
`

const Heading = styled.h2`
    text-align: center;
    font-size: 1.3em;
    padding: 5px;
` 

const SubHeading = styled.h3`
    font-size: 1.1em;
    padding-top: 5px;
    padding-bottom: 5px;
`