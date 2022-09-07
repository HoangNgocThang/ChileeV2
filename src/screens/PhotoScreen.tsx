import React, {Component} from 'react';
import {Image, Modal, TouchableOpacity} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
// @ts-ignore
import closeDialog from "../assets/closeDialog.png";

interface State {
    images: []
}

export default class PhotoScreen extends Component<any, State> {
    constructor(props: any) {
        super(props);
       // this.state.images = navigation.getParam('images');
     //   console.log(this.props.navigation.getParam('images'));
        this.state = {
           // images: this.props.navigation.getParam('images'),
            images: this.props.route.params.images || []
        }
    }

    cancel() {
        this.props.navigation.goBack();
    }

    renderModalHeader() {
        return (
            <TouchableOpacity style={{ position: "absolute", top: 50, left: 25, zIndex: 1 }} onPress={() =>
                this.props.navigation.goBack()
            }>
                <Image source={closeDialog} style={{ width: 40, height: 40 }} />
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <Modal visible={true} transparent={true}>
                <ImageViewer imageUrls={this.state.images}
                             saveToLocalByLongPress={false}
                             renderHeader={() => this.renderModalHeader()}
                             enableSwipeDown={true} onCancel={() => this.cancel()}/>
            </Modal>
        )
    }
}
