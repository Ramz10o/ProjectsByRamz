# Python code to detect faces on live video
# pip install opencv-python
# install cmake from cmake.org
# install visual studio for c++
# pip install cmake
#pip install dlib 

import cv2 as c
import dlib as d
vid = c.VideoCapture(0)
detector = d.get_frontal_face_detector()
while True :
    ret, img = vid.read()
    faces = detector(c.cvtColor(img,c.COLOR_BGR2GRAY)) 
    for face in faces :
        c.rectangle(img,(face.left(),face.top()),(face.left()+face.width(),face.top()+face.height()),(255,100,180),2)
    c.imshow('Press "q" to quit ',img)
    if c.waitKey(1) & 0xFF == ord('q') :
        break
c.destroyAllWindows()
vid.release()